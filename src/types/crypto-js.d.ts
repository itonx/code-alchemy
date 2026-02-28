declare module "crypto-js" {
  namespace CryptoJS {
    namespace lib {
      type WordArray = {
        words: number[];
        sigBytes: number;
        toString: (encoder?: unknown) => string;
      };

      namespace WordArray {
        function create(words?: number[], sigBytes?: number): WordArray;
      }
    }

    const enc: {
      Hex: unknown;
    };

    function MD5(message: lib.WordArray | string): lib.WordArray;
    function SHA1(message: lib.WordArray | string): lib.WordArray;
    function SHA256(message: lib.WordArray | string): lib.WordArray;
    function SHA384(message: lib.WordArray | string): lib.WordArray;
    function SHA512(message: lib.WordArray | string): lib.WordArray;
  }

  export = CryptoJS;
}
