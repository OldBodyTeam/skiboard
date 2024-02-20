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
  CreateUserDto,
  LoginUserDto,
  RegisterUserDto,
  UserAvatarDto,
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
  userControllerCreate = (data: CreateUserDto, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/user`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
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
        data?: CreateUserDto;
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
}
