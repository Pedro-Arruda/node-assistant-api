export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 10,
  delay: number = 3000
): Promise<T> => {
  let attempts = 0;

  while (attempts < retries) {
    try {
      return await fn();
    } catch (error) {
      attempts++;
      if (attempts >= retries) throw error;
      console.log(`Retrying... Attempt ${attempts}/${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Failed after maximum retries");
};
