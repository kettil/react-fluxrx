import { Subscription as SubscriptionType } from 'create-subscription';
import React, { ComponentType } from 'react';

import {
  createSubscriptionType,
  optionsConnectType,
  propsMergeReturnType,
  propsMergeType,
  storeType,
  subscriptionType,
} from './types';

/**
 *
 * @param Consumer
 * @param param1
 */
export function createElementWithoutSubscription<S, P, MS, MD>(
  Consumer: ComponentType<React.ConsumerProps<storeType<S>>>,
  { mapDispatchToProps, mergeProps }: optionsConnectType<S, P, MS, MD>,
) {
  return (Element: ComponentType<propsMergeReturnType<P, MS, MD>>): ComponentType<P> => (ownProps) => (
    <Consumer>
      {(store) => {
        const props = mergeProps({} as MS, mapDispatchToProps(store.dispatch, ownProps), ownProps);

        return <Element {...props} />;
      }}
    </Consumer>
  );
}

/**
 *
 * @param Consumer
 * @param options
 */
export function createElementWithSubscription<S, P, MS, MD>(
  Consumer: ComponentType<React.ConsumerProps<storeType<S>>>,
  options: optionsConnectType<S, P, MS, MD>,
) {
  const propsFactory = options.propsFactory(
    options.mapStateToPropsWithCacheFactory(options.mapStateToProps, options.areStatesEqual, options.arePropsEqual),
    options.mapDispatchToPropsWithCacheFactory(options.mapDispatchToProps, options.arePropsEqual),
    options.mergePropsWithCacheFactory(
      options.mergeProps,
      options.arePropsEqual,
      options.areMappedEqual,
      options.areDispatchedEqual,
    ),
    options.mapStateToProps,
    options.mapDispatchToProps,
  );

  return (Element: ComponentType<propsMergeReturnType<P, MS, MD>>): ComponentType<P> => (ownProps) => (
    <Consumer>
      {(store) => {
        const Subscription = options.createSubscriptionWrapper(
          options.createSubscription,
          propsFactory(store.dispatch),
        );
        return <Subscription source={{ store, ownProps }}>{(props) => <Element {...props} />}</Subscription>;
      }}
    </Consumer>
  );
}

/**
 *
 * @param merge
 */
export function createSubscriptionWrapper<S, P, MS, MD>(
  createSubscription: createSubscriptionType<S, P, MS, MD>,
  merge: propsMergeType<S, P, MS, MD>,
): SubscriptionType<subscriptionType<S, P>, propsMergeReturnType<P, MS, MD>> {
  // cache props object
  let nowProps: propsMergeReturnType<P, MS, MD>;
  // create subscription element
  return createSubscription({
    getCurrentValue(source) {
      nowProps = merge(source.store.getState(), source.ownProps);
      return nowProps;
    },

    subscribe(source, callback) {
      const subscription = source.store.subscribe((state) => {
        // create new props object
        const nextProps = merge(state, source.ownProps);
        // is new props not equal with old props...
        if (nowProps !== nextProps) {
          nowProps = nextProps;
          // ... update element
          callback(nextProps);
        }
      });

      return () => subscription.unsubscribe();
    },
  });
}
