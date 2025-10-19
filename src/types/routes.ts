import { type ComponentType, type ReactNode } from 'react';

export interface RouteConfig {
  path: string;
  component: ComponentType;
  title: string;
  protected?: boolean;
  children?: readonly RouteConfig[];
  redirect?: string;
  layout?: ComponentType<{ children: ReactNode }>;
}

export interface AppRoute extends RouteConfig {
  children?: readonly AppRoute[];
}

export type RouteConfigArray = readonly RouteConfig[];
