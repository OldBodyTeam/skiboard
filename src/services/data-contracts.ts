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

export interface UserEntity {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  /** @format date-time */
  createAt: string;
  /** @format date-time */
  updateAt: string;
  /** @format date-time */
  deleteAt: string;
  collections: CollectionEntity[];
}

export interface CollectionEntity {
  id: string;
  name: string;
  frameList: string;
  /** @format date-time */
  createAt: string;
  /** @format date-time */
  updateAt: string;
  /** @format date-time */
  deleteAt: string;
  owner: UserEntity;
}

export interface CreateUserDto {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  createTime: string;
  updateTime: string;
}

export interface UserAvatarDto {
  /** @format FormData */
  file: formData;
}

export interface UsernameDto {
  username: string;
}

export interface CreateCollectionDto {
  name: string;
  frameList: string;
}

export interface UpdateCollectionDto {
  name?: string;
  frameList?: string;
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

export interface ModifyPasswordDto {
  email: string;
  passwordOne: string;
  passwordTwo: string;
}
