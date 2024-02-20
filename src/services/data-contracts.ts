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

export interface CreateUserDto {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  /** @format date-time */
  createTime: string;
  /** @format date-time */
  updateTime: string;
}

export interface UserAvatarDto {
  /** @format binary */
  file: File;
}

export interface UsernameDto {
  username: string;
}

export interface AuthUserDto {
  access_token: string;
  message: string;
  userId: string;
}

export interface LoginUserDto {
  email_name: string;
  password: string;
}

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
}
