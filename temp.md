```javascript
function isPrimeOrFactor(number) {
  if (number <= 1) {
    return "Not prime (less than or equal to 1)";
  }

  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      return `Not prime, factor: ${i}`;
    }
  }

  return "Prime";
}


// Example usage
console.log(isPrimeOrFactor(2));   // Output: Prime
console.log(isPrimeOrFactor(4));   // Output: Not prime, factor: 2
console.log(isPrimeOrFactor(15));  // Output: Not prime, factor: 3
console.log(isPrimeOrFactor(1));   // Output: Not prime (less than or equal to 1)
console.log(isPrimeOrFactor(17));  // Output: Prime
console.log(isPrimeOrFactor(0));  // Output: Not prime (less than or equal to 1)
```






```javascript
/**
 * Determines if a number is prime and returns its smallest factor if not prime.
 *
 * @param {number} number The number to check.
 * @returns {boolean | number} True if the number is prime, otherwise the smallest factor.
 *                           Returns null if the input is invalid (e.g., not a number or less than 2).
 *
 * @throws {TypeError} if the input is not a number.
 *
 * @example
 * isPrime(2)   // returns true
 * isPrime(3)   // returns true
 * isPrime(4)   // returns 2
 * isPrime(9)   // returns 3
 * isPrime(29)  // returns true
 * isPrime(1)   // returns null
 * isPrime(0)   // returns null
 * isPrime(-5)  // returns null
 * isPrime("abc") // throws TypeError
 */
function isPrime(number) {
  // Input validation: check if the input is a number.
  if (typeof number !== 'number') {
    throw new TypeError("Input must be a number.");
  }

  // Handle edge cases: numbers less than 2 are not prime.
  if (number < 2) {
    return null; // Or throw an error, depending on the desired behavior.
  }

  // Optimization: 2 is the only even prime number.
  if (number === 2) {
    return true;
  }

  if (number % 2 === 0) {
    return 2; // 2 is the smallest factor
  }
  // Optimized primality test: only check odd numbers up to the square root of the number.
  const sqrtNumber = Math.sqrt(number);
  for (let i = 3; i <= sqrtNumber; i += 2) {
    if (number % i === 0) {
      return i; // i is the smallest factor
    }
  }

  // If no factors are found, the number is prime.
  return true;
}


// Example usage (demonstrating different scenarios and error handling):
try {
  console.log("isPrime(2):", isPrime(2));   // true
  console.log("isPrime(3):", isPrime(3));   // true
  console.log("isPrime(4):", isPrime(4));   // 2
  console.log("isPrime(9):", isPrime(9));   // 3
  console.log("isPrime(29):", isPrime(29));  // true
  console.log("isPrime(1):", isPrime(1));   // null
  console.log("isPrime(0):", isPrime(0));   // null
  console.log("isPrime(-5):", isPrime(-5));  // null

  // Testing with large numbers for performance.
  console.log("isPrime(7919):", isPrime(7919));  // true
  console.log("isPrime(7920):", isPrime(7920)); // 2

  // Expecting type error
  //console.log("isPrime('abc'):", isPrime("abc"));  // Throws TypeError

} catch (error) {
  console.error("An error occurred:", error.message);
}
```




```javascript
 /**
  * Checks if a number is prime. If not, returns the smallest factor.
  *
  * @param {number} number The number to check.
  * @returns {boolean | number} True if prime, otherwise the smallest factor.
  * @throws {TypeError} If the input is not a number.
  * @throws {Error} If the input is not a positive integer.
  */
 const isPrimeOrFactor = (number) => {
  // Input validation: Ensure the input is a number
  if (typeof number !== 'number') {
   throw new TypeError('Input must be a number.');
  }

  // Input validation: Ensure the number is a positive integer.
  if (!Number.isInteger(number) || number <= 0) {
   throw new Error('Input must be a positive integer.');
  }

  // Handle base cases: 1 is not prime, 2 and 3 are prime
  if (number === 1) {
   return false; // 1 is not considered prime
  }
  if (number <= 3) {
   return true; // 2 and 3 are prime
  }

  // Optimization: Check divisibility by 2 and 3
  if (number % 2 === 0) {
   return 2; // Smallest factor is 2
  }
  if (number % 3 === 0) {
   return 3; // Smallest factor is 3
  }

  // Optimization: Iterate through potential factors starting from 5
  // We only need to check up to the square root of the number
  for (let i = 5; i <= Math.sqrt(number); i += 6) {
   if (number % i === 0) {
    return i; // Found a factor
   }
   if (number % (i + 2) === 0) {
    return i + 2; // Found a factor
   }
  }

  // If no factors found, the number is prime
  return true;
 };

 // Example Usage:
 try {
  console.log(isPrimeOrFactor(2)); // Output: true
  console.log(isPrimeOrFactor(10)); // Output: 2
  console.log(isPrimeOrFactor(17)); // Output: true
  console.log(isPrimeOrFactor(49)); // Output: 7
  console.log(isPrimeOrFactor(1)); // Output: false
 } catch (error) {
  console.error(error.message);
 }

 // Example Usage with error handling:
 try {
  console.log(isPrimeOrFactor('hello'));
 } catch (error) {
  console.error(error.message); // Output: Input must be a number.
 }

 try {
  console.log(isPrimeOrFactor(-5));
 } catch (error) {
  console.error(error.message); // Output: Input must be a positive integer.
 }
 ```

 