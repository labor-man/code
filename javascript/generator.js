// import 'lodash';

const foo = (name, callback) => {
  setTimeout(() => {
    callback(name);
  }, 2000);
};

const controller = (generator) => {
  const iterator = generator();

  const advancer = (response) => {
    var state;

    state = iterator.next(response);

    if (!state.done) {
      state.value(advancer);
    }
  }

  advancer();
};

const curriedFoo = _.curry(foo);

controller(function* () {
  const a = yield curriedFoo('a');
  console.log(a);
  const b = yield curriedFoo('b');
  console.log(b);
  const c = yield curriedFoo('c');
  console.log(c);
});
