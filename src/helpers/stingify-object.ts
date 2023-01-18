type StringifyObjectProps<Type extends Object> = {
  [Key in keyof Type]: string;
};

const stringifyProps = <Type extends Object>(object: Type): StringifyObjectProps<Type> => {
  const objectLikeArray = Object.entries(object);

  const objectWithPropsStringified = objectLikeArray.reduce<Partial<StringifyObjectProps<Type>>>(
    (prevObj, [key, value]) => ({
      ...prevObj,
      [key]: String(value),
    }),
    // eslint-disable-next-line @typescript-eslint/comma-dangle
    {}
  );

  return objectWithPropsStringified as StringifyObjectProps<Type>;
};

export default stringifyProps;
