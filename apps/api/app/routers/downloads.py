import asyncio
import os
import queue

from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import Request
from fastapi import status
from fastapi.responses import FileResponse
from sse_starlette.sse import EventSourceResponse
from ydcore import AudioFormat
from ydcore import AvailableDownloadOptions
from ydcore import DownloadQuality
from ydcore import VideoFormat
from ydcore import VideoWithOptions
from ydcore import VideoWithOptionsAndStatus

from ..dependencies import depends_download_responses
from ..dependencies import depends_session_responses
from ..dependencies import DependsDownload
from ..dependencies import DependsSession
from ..session import Session
from ..session import session_manager

router = APIRouter(
    prefix='/downloads',
    tags=['downloads'],
    responses=depends_session_responses,
)


@router.get('')
def get_downloads(session: DependsSession) -> list[VideoWithOptionsAndStatus]:
    return session.download_manager.get_all_videos()


@router.post('', status_code=status.HTTP_201_CREATED)
def post_downloads(
    video: VideoWithOptions, session: DependsSession,
) -> VideoWithOptions:
    session.download_manager.add(video)
    return video


@router.put('')
def put_downloads(
    video: VideoWithOptions, session: DependsSession,
) -> VideoWithOptions:
    session.download_manager.remove(video.id)
    session.download_manager.add(video)
    return video


@router.get('/options')
def get_downloads_options(session: DependsSession) -> AvailableDownloadOptions:
    return AvailableDownloadOptions(
        format=[f for f in AudioFormat] + [f for f in VideoFormat],
        quality=[q for q in DownloadQuality],
        embed_metadata=[True, False],
        embed_thumbnail=[True, False],
        embed_subtitles=[True, False],
    )


async def status_stream(request: Request, session: Session):
    try:
        while True:
            if await request.is_disconnected():
                break
            try:
                update = session.status_queue.get_nowait()
                yield dict(data=update.model_dump_json())
            except queue.Empty:
                await asyncio.sleep(1)
    except (asyncio.CancelledError, asyncio.exceptions.InvalidStateError):
        pass


# Exclude from OpenAPI schema as there is no support for Server Sent Events.
@router.get('/status', include_in_schema=False)
async def get_downloads_status(request: Request, session_id: str):
    session = session_manager.get(session_id)
    if session is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    event_source = status_stream(request, session)
    return EventSourceResponse(event_source)


@router.get('/{video_id}', responses=depends_download_responses)
def get_download(download: DependsDownload) -> VideoWithOptionsAndStatus:
    return VideoWithOptionsAndStatus(
        **download.video.model_dump(), status=download.status,
    )


@router.get(
    '/{video_id}/file', response_class=FileResponse,
    responses=depends_download_responses | {
        status.HTTP_200_OK: {
            'content': {
                'audio/*': {'schema': {'type': 'file'}},
                'video/*': {'schema': {'type': 'file'}},
            },
        },
    },
)
def get_download_file(download: DependsDownload):
    if os.path.exists(download.path):
        return FileResponse(
            download.path, filename=download.filename_using_title,
        )
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)


@router.delete(
    '/{video_id}', status_code=status.HTTP_204_NO_CONTENT,
    responses=depends_download_responses,
)
def delete_download(
    download: DependsDownload,
    session: DependsSession,
) -> None:
    session.download_manager.remove(download.video.id)
