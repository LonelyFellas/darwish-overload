type AnyType =
  | "null"
  | "undefined"
  | "string"
  | "boolean"
  | "object"
  | "array"
  | "symbol"
  | "date"
  | "function"
  | "regexp"
  | "set"
  | "map"
  | "weakmap"
  | "weakset"
  | "bigint"
  | "number";
/**
 * @description 检测数据类型
 * @param data 需要判断的类型的数据，可以是任何数据去判断出任何类型
 * @returns 返回是一个类型结果字符串 'null' | 'undefined' | 'string' | 'boolean' | 'object' | 'array' | 'symbol' | 'date' | 'function' | 'RegExp' | 'Set'
 */

function typeOfData(data: unknown): AnyType {
  try {
    return Object.prototype.toString
      .call(data)
      .slice(8, -1)
      .toLowerCase() as AnyType;
  } catch (error) {
    return "null";
  }
}
interface JsOverload {
  [key: string]: any;
}
/**
 * js 方法重写
 */
class JsOverload implements JsOverload {
  olName = "";
  olFnMap = new Map();
  constructor(olName: string) {
    this.olName = olName;
  }

  /**
   *
   * @param customFn 一个回调函数，它接受多样的参数，这个多样参数和types联动，内部实现了一个map，types的作为key，customFn作为value
   * @param types 注意这里必须要跟第一个参数回调函数的里面的参数类型相同，不然没办法输出你的预期结果
   */
  addImpl = (customFn: (...args: any[]) => void, types: AnyType[]) => {
    this.olFnMap.set(types.join("_"), customFn);
    this[this.olName] = function (...ovArgs: any[]) {
      const ovArgsArr = ovArgs.map((arg) => typeOfData(arg));
      const fn = this.olFnMap.get(ovArgsArr.join("_"));
      return fn(...ovArgs);
    };
  };
}

export default JsOverload;

const fn = new JsOverload("testFn");
const testFnNumNum = (a: number, b: number) => {
  return a + b;
};
const testFnStrStr = (a: string, b: string) => {
  return [a, b].join("___");
};
