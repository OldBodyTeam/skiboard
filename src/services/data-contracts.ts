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
  /** 用户ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 用户邮箱 */
  email: string;
  /** 用户密码 */
  password: string;
  /** 用户头像URL */
  avatar: string;
  /**
   * 创建时间
   * @format date-time
   */
  createAt: string;
  /**
   * 更新时间
   * @format date-time
   */
  updateAt: string;
  /**
   * 删除时间
   * @format date-time
   */
  deleteAt: string;
  /** 用户收藏列表 */
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
