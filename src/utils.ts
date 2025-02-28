let total=0;
export function measureExecutionTime(label?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(`⏳ Start: ${propertyKey}`);
      const start = performance.now();
      document.getElementById('debug')!.innerHTML += propertyKey+'...<br/>';
      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return result.then((res) => {
          const end = performance.now();
          total+=(end - start);
          console.log(`✅ End: ${propertyKey} | Time: ${(end - start).toFixed(2)} ms`);
          document.getElementById('debug')!.innerHTML += propertyKey+' executed in '+(end - start).toFixed(2)+' ms, Total: '+total.toFixed(2)+' ms<br/>';
          return res;
        });
      }

      const end = performance.now();
      total+=(end - start);
      console.log(`✅ End: ${propertyKey} | Time: ${(end - start).toFixed(2)} ms`);
      document.getElementById('debug')!.innerHTML += propertyKey+' executed in '+(end - start).toFixed(2)+' ms ,Total: '+total.toFixed(2)+' ms<br/>';
      return result;
    };


    return descriptor;
  };
}
