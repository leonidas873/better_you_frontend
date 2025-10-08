import { ComponentType } from 'react';

export interface RouteConfig {
  path: string;
  component: ComponentType;
  title: string;
  protected?: boolean;
  children?: RouteConfig[];
}

export interface AppRoute extends RouteConfig {
  children?: AppRoute[];
}

export type RouteConfigArray = RouteConfig[];
