/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  AuthUserDto,
  CollectionEntity,
  CreateCollectionDto,
  CreateUserDto,
  LoginUserDto,
  RegisterUserDto,
  UpdateCollectionDto,
  UserAvatarDto,
  UserEntity,
  UsernameDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags user
   * @name UserControllerCreate
   * @request POST:/api/user
   * @secure
   */
  userControllerCreate = (data: UserEntity, params: RequestParams = {}) =>
    this.request<UserEntity, any>({
      path: `/api/user`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserControllerModifyAvatar
   * @request POST:/api/user/{id}/avatar
   * @secure
   */
  userControllerModifyAvatar = (id: string, data: UserAvatarDto, params: RequestParams = {}) =>
    this.request<
      {
        data?: CreateUserDto;
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/user/${id}/avatar`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserControllerModifyUsername
   * @request PUT:/api/user/{id}/username
   * @secure
   */
  userControllerModifyUsername = (id: string, data: UsernameDto, params: RequestParams = {}) =>
    this.request<
      {
        data?: CreateUserDto;
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/user/${id}/username`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserControllerUser
   * @request GET:/api/user/{id}
   * @secure
   */
  userControllerUser = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        data?: CreateUserDto;
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/user/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags collection
   * @name CollectionControllerCreate
   * @request POST:/api/collection/{userId}/collection/create
   * @secure
   */
  collectionControllerCreate = (userId: string, data: CreateCollectionDto, params: RequestParams = {}) =>
    this.request<
      {
        data?: {
          collection?: CollectionEntity;
          userInfo?: UserEntity;
        };
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/collection/${userId}/collection/create`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags collection
   * @name CollectionControllerModifyCollection
   * @request PUT:/api/collection/{collectionId}/update
   * @secure
   */
  collectionControllerModifyCollection = (
    collectionId: string,
    data: UpdateCollectionDto,
    params: RequestParams = {},
  ) =>
    this.request<
      {
        data?: CollectionEntity;
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/collection/${collectionId}/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags collection
   * @name CollectionControllerDeleteCollection
   * @request DELETE:/api/collection/{collectionId}/delete
   * @secure
   */
  collectionControllerDeleteCollection = (collectionId: string, params: RequestParams = {}) =>
    this.request<
      {
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/collection/${collectionId}/delete`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags collection
   * @name CollectionControllerDeleteFrameList
   * @request DELETE:/api/collection/{collectionId}/frameList
   * @secure
   */
  collectionControllerDeleteFrameList = (
    collectionId: string,
    data: {
      position?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/collection/${collectionId}/frameList`,
      method: 'DELETE',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags collection
   * @name CollectionControllerCopyFrameItem
   * @request POST:/api/collection/{collectionId}/frame/copy
   * @secure
   */
  collectionControllerCopyFrameItem = (
    collectionId: string,
    data: {
      position?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/collection/${collectionId}/frame/copy`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags collection
   * @name CollectionControllerGetCollectionList
   * @request GET:/api/collection/list/user/{userId}
   * @secure
   */
  collectionControllerGetCollectionList = (userId: string, params: RequestParams = {}) =>
    this.request<
      {
        data?: CollectionEntity;
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/collection/list/user/${userId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags collection
   * @name CollectionControllerGetCollectionDetail
   * @request GET:/api/collection/{collectionId}
   * @secure
   */
  collectionControllerGetCollectionDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<
      {
        data?: CollectionEntity;
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/collection/${collectionId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthControllerLogin
   * @request POST:/api/auth/login
   */
  authControllerLogin = (data: LoginUserDto, params: RequestParams = {}) =>
    this.request<
      {
        data?: AuthUserDto;
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/auth/login`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthControllerRegister
   * @request POST:/api/auth/register
   */
  authControllerRegister = (data: RegisterUserDto, params: RequestParams = {}) =>
    this.request<
      {
        data?: UserEntity;
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/auth/register`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthControllerGetProfile
   * @request GET:/api/auth/profile
   */
  authControllerGetProfile = (params: RequestParams = {}) =>
    this.request<
      {
        data?: {
          sub?: string;
        };
        msg?: string;
        code?: number;
      },
      any
    >({
      path: `/api/auth/profile`,
      method: 'GET',
      format: 'json',
      ...params,
    });
}
