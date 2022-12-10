---
title: bulletproof-reactを参考にzodとreact-hook-formを組み合わせる
createdAt: 2022-12-08
tags: ["zod", "reacthookform", "react"]
---

zodとreact-hook-formの組み合わせを考え、Render propとカスタムフックの2通りで実装してみました。コードはこちらにあります。

[playground/zod-form at main · tekihei2317/playground](https://github.com/tekihei2317/playground/tree/main/zod-form)

フォームは、ユーザーからの入力を扱いやすい形式に変換するものと考えられます。これをzodの`transform`で行います。

例えば、ユーザー登録フォームで誕生日を入力するとします。ユーザーにYYYYMMDDの形式の文字列で入力してもらい、使う側からは`Date`で扱いたいとします。これは例えば以下のように実装できます。

```ts
import { z } from "zod";

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

function toYmd(dateString: string): string {
  return `${dateString.substring(0, 4)}-${dateString.substring(
    4,
    6
  )}-${dateString.substring(6, 8)}`;
}

export const dateString = z
  .string()
  .regex(/^[0-9]{8}$/, { message: "日付を正しい形式で入力してください" })
  .refine((val) => isValidDate(new Date(toYmd(val))), {
    message: "有効な日付ではありません",
  })
  .transform((val) => new Date(toYmd(val)));

dateString.safeParse("20220101"); // { success: true, data: 2022-01-01T00:00:00.000Z }
dateString.safeParse("invalid format"); // { success: false, error: [...] }
dateString.safeParse("20220000"); // { success: false, error: [...] }
```

このように、変換処理をzodで行う前提で、フォームのコンポーネントを作ってみました。

## Render propで実装する

bulletproof-reactのFormコンポーネントを参考に実装してみました。

[bulletproof-react/Form.tsx at master · alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/src/components/Form/Form.tsx)

bulletproof-reactの実装では、Formコンポーネントにスキーマの型とフォームのフィールドの型を渡していますが、後者は前者から推論できるのでスキーマの型だけ渡すようにしました。

ポイントは、onSubmitには`transform`で変換した値が入るので、型に`z.output`を使っていることです。zodのスキーマで`transform`を使う場合は、`z.input`がスキーマの型で、`z.output`が変換後の型になります。

```tsx
import { z, ZodType } from "zod";
import {
  useForm,
  FieldValues,
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormProps<TSchema extends ZodType<FieldValues>> = {
  schema: TSchema;
  // onSubmitには変換後の値が入るので、z.outputを使う
  onSubmit: SubmitHandler<z.output<TSchema>>;
  children: (methods: UseFormReturn<z.input<TSchema>>) => React.ReactNode;
  options?: UseFormProps<z.input<TSchema>>;
} & Omit<React.ComponentProps<"form">, "onSubmit" | "children">;

export const Form = <TSchema extends ZodType<FieldValues>>({
  schema,
  onSubmit,
  children,
  options,
  ...props
}: FormProps<TSchema>) => {
  const methods = useForm<z.input<TSchema>>({
    resolver: zodResolver(schema),
    ...options,
  });
  const handleSubmit = methods.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children(methods)}
    </form>
  );
};
```

使用側は以下のようになります。ジェネリクスは推論してくれるので書かなくても良いです。

```tsx
const registrationFormSchema = z.object({
  userName: stringSchema.max(15),
  email: stringSchema.email(),
  birthDate: dateString,
});

const FormUsingRenderProp = () => {
  return (
    <Form<typeof registrationFormSchema>
      schema={registrationFormSchema}
      onSubmit={(d) => console.log(d)}
      className="flex flex-col gap-4 items-start max-w-xl mx-auto"
      options={{
        defaultValues: {
          birthDate: "20000101",
        },
      }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <label>
            ユーザー名
            <input {...register("userName")} className="border" />
            <p className="text-sm text-red-500">{errors.userName?.message}</p>
          </label>
          <label>
            メールアドレス
            <input {...register("email")} className="border" />
            <p className="text-sm text-red-500">{errors.email?.message}</p>
          </label>
          <label>
            生年月日
            <input {...register("birthDate")} className="border" />
            <p className="text-sm text-red-500">{errors.birthDate?.message}</p>
          </label>
          <button type="submit" className="bg-blue-200 px-4 py-2 rounded">
            登録
          </button>
        </>
      )}
    </Form>
  );
};
```

## カスタムフックで実装する

カスタムフックでもできる気がしたので、`useZodForm`というカスタムフックを作ってみました。`useZodForm`の引数はzodのスキーマと`useForm`のオプションで、戻り値は`useForm`の戻り値と`Form`コンポーネントです。

```tsx
type ZodFormProps<TSchema extends ZodType<FieldValues>> = {
  onSubmit: SubmitHandler<z.output<TSchema>>;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"form">, "onSubmit" | "children">;

type UseZodFormReturn<TSchema extends ZodType<FieldValues>> = UseFormReturn<
  z.input<TSchema>
> & {
  Form: (props: ZodFormProps<TSchema>) => JSX.Element;
};

export function useZodForm<TSchema extends ZodType<FieldValues>>(
  schema: TSchema,
  options: UseFormProps<z.input<TSchema>> = {}
): UseZodFormReturn<TSchema> {
  const methods = useForm<z.input<TSchema>>({
    resolver: zodResolver(schema),
    ...options,
  });

  const Form = useCallback(
    ({ onSubmit, children, ...props }: ZodFormProps<TSchema>) => {
      const handleSubmit = methods.handleSubmit(onSubmit);

      return (
        <form onSubmit={handleSubmit} {...props}>
          {children}
        </form>
      );
    },
    [methods]
  );

  return { ...methods, Form };
}
```

使用側は以下のようになります。Render propを使った実装と比べると、`register`や`formState`のスコープが広いことがデメリットですが、インデントが浅いので読みやすいです。

```tsx
const FormUsingCustomHook = () => {
  const {
    Form,
    register,
    formState: { errors },
  } = useZodForm(registrationFormSchema, {
    defaultValues: {
      birthDate: "20000101",
    },
  });

  return (
    <Form
      onSubmit={(d) => console.log(d)}
      className="flex flex-col gap-4 items-start max-w-xl mx-auto"
    >
      <label>
        ユーザー名
        <input {...register("userName")} className="border" />
        <p className="text-sm text-red-500">{errors.userName?.message}</p>
      </label>
      <label>
        メールアドレス
        <input {...register("email")} className="border" />
        <p className="text-sm text-red-500">{errors.email?.message}</p>
      </label>
      <label>
        生年月日
        <input {...register("birthDate")} className="border" />
        <p className="text-sm text-red-500">{errors.birthDate?.message}</p>
      </label>
      <button type="submit" className="bg-blue-200 px-4 py-2 rounded">
        登録
      </button>
    </Form>
  );
};
```

## まとめ

zodとreact-hook-formを組み合わせてフォームを実装しました。zodのtransformを使って、ユーザーの入力を扱いやすい形に変換しました。また、Render propとカスタムフックの2通りの方法で通りの方法で実装し、長所と短所を比較しました。

## 参考

- [alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react)
- [react-hook-form と zod でバリデーションのその先へ](https://zenn.dev/uzimaru0000/articles/react-hook-form-with-zod)
