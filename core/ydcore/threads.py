import os
import threading

from yt_dlp import YoutubeDL

from .config import DownloadConfig
from .config import StatusHook
from .models import DownloadState
from .models import DownloadStatus
from .models import VideoWithOptions
from .models import VideoWithOptionsAndStatus


class YoutubeDownloadThread(threading.Thread):
    def __init__(
        self,
        video: VideoWithOptions,
        output_directory: str,
        status_hook: StatusHook,
    ):
        self.video = video
        self.status = DownloadStatus(state=DownloadState.WAITING)
        self._output_directory = output_directory
        self._status_hook = status_hook
        self._config = DownloadConfig(self.video, output_directory)
        self._config.add_status_hook(self.handle_status_update)
        self._downloader = YoutubeDL(self._config.as_ytdlp_params)
        super().__init__(
            group=None, target=None, name=None, daemon=True,
        )

    @property
    def filename(self) -> str:
        return f'{self.video.id}.{self.video.options.format.value}'

    @property
    def path(self) -> str:
        return os.path.join(self._output_directory, self.filename)

    @property
    def filename_using_title(self) -> str:
        return f'{self.video.title}.{self.video.options.format.value}'

    def remove(self) -> bool:
        if os.path.exists(self.path):
            os.remove(self.path)
            return True
        return False

    def run(self):
        self.handle_status_update(
            VideoWithOptionsAndStatus(
                **self.video.model_dump(),
                status=DownloadStatus(state=DownloadState.DOWNLOADING),
            ),
        )
        try:
            self._downloader.download([str(self.video.url)])
        except Exception:
            self.handle_status_update(
                VideoWithOptionsAndStatus(
                    **self.video.model_dump(),
                    status=DownloadStatus(state=DownloadState.ERROR),
                ),
            )

    def handle_status_update(self, update: VideoWithOptionsAndStatus) -> None:
        self.status = update.status
        self._status_hook(update)