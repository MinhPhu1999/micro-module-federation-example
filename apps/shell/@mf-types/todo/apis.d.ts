
    export type RemoteKeys = 'todo/TodoPage';
    type PackageType<T> = T extends 'todo/TodoPage' ? typeof import('todo/TodoPage') :any;