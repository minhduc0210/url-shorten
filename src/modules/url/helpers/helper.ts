import { customAlphabet } from 'nanoid';
import { ALPHABET, SIZE } from 'src/common/constants/constant';

export const generateRandomCode = (size: number = SIZE): string => {
  const nanoid = customAlphabet(ALPHABET, size);
  return nanoid();
};
