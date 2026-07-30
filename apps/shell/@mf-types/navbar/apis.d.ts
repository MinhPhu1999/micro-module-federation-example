
    export type RemoteKeys = 'navbar/Navbar';
    type PackageType<T> = T extends 'navbar/Navbar' ? typeof import('navbar/Navbar') :any;