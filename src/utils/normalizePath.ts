const normalizePath = (path: string) => path.replace(/\/+$/, ''); // 마지막 '/' 제거

export default normalizePath;
