/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Video } from '../models/Video';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SearchService {

  /**
   * Get Search
   * @param term
   * @param results
   * @returns Video Successful Response
   * @throws ApiError
   */
  public static getSearch(
    term: string,
    results: number = 12,
  ): CancelablePromise<Array<Video>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/search',
      query: {
        'term': term,
        'results': results,
      },
      errors: {
        403: `Forbidden`,
        404: `Not Found`,
        422: `Validation Error`,
      },
    });
  }

}