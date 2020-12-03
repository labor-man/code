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

// with error handling
const foo = (parameters, callback) => {
    setTimeout(() => {
        console.log('callback', callback);
        callback(parameters);
    }, 100);
};


const controller = (generator) => {
    const iterator = generator();

    const advancer = (response) => {
        if (response && response.error) {
            return iterator.throw(response.error);
        }

        const state = iterator.next(response);

        if (!state.done) {
            console.log('state.value:', state.value);
            console.log('advancer:', advancer);
            state.value(advancer);
        }
    }

    advancer();
};

controller(function* () {
    let a,
        b,
        c;

    try {
        a = yield _.curry(foo)('a');
        b = yield _.curry(foo)({error: 'Something went wrong.'});
        c = yield _.curry(foo)('c');
    } catch (e) {
        console.log(e);
    }

    console.log(a, b, c);
});
