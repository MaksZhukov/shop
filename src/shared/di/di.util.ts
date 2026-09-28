export type BoundValue<Bindings, Token> = Token extends new (...args: never[]) => infer Instance
	? Instance
	: Token extends keyof Bindings
		? Bindings[Token]
		: never;

export const getBound = <Bindings, Token>(
	container: { get: (token: Token) => unknown },
	token: Token
): BoundValue<Bindings, Token> => container.get(token) as BoundValue<Bindings, Token>;
