import test from 'ava';
import m from '..';

const options = {
	cwd: __dirname
};

test('incorrect input', t => {
	t.throws(() => m(1), 'Expected `filePath` to be of type `string`, got `number`');
});

test('load entire file if no environment is set', t => {
	const ctx = {};
	m('config.json', options)(ctx);

	t.deepEqual(ctx.config, {
		prod: {
			foo: 'bar',
			FooService: 'foo:v0',
			FooTopicARN: 'arn:aws:sns:eu-west-1:123456789012:Foo'
		}
	});
});

test('load correct environment if not running in specific mode', t => {
	const ctx = {
		env: 'prod',
		context: {
			invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:unicorn:v0'
		}
	};

	m('config.json', options)(ctx);

	t.deepEqual(ctx.config, {
		foo: 'bar',
		FooService: 'foo:v0',
		FooTopicARN: 'arn:aws:sns:eu-west-1:123456789012:Foo'
	});
});

test('transform config based on invoked function arn', t => {
	const ctx = {
		env: 'prod',
		context: {
			invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:unicorn:e2e-v0'
		}
	};

	m('config.json', options)(ctx);

	t.deepEqual(ctx.config, {
		foo: 'bar',
		FooService: 'foo:e2e-v0',
		FooTopicARN: 'arn:aws:sns:eu-west-1:123456789012:Foo_E2E'
	});
});
