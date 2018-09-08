import React, { ComponentType } from 'react';
import { createSubscription, Subscription } from 'create-subscription';

import {
  optionsConnect,
  storeType,
  propsMergeType,
  subscriptionType,
  propsMergeReturnType,
} from './utils/types';

/**
 *
 * @param Consumer
 * @param Subscription
 */
export function getElementWithoutSubscription<S, P, MS, MD>(
  Consumer: ComponentType<React.ConsumerProps<storeType<S>>>,
  { mapDispatchToProps, mergeProps }: optionsConnect<S, P, MS, MD>,
) {
  return (Element: ComponentType<propsMergeReturnType<P, MS, MD>>): ComponentType<P> => (
    ownProps,
  ) => (
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
 * @param Subscription
 */
export function getElementWithSubscription<S, P, MS, MD>(
  Consumer: ComponentType<React.ConsumerProps<storeType<S>>>,
  options: optionsConnect<S, P, MS, MD>,
) {
  const propsFactory = options.propsFactory(
    options.mapStateToPropsWithCacheFactory(
      options.mapStateToProps,
      options.areStatesEqual,
      options.arePropsEqual,
    ),
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

  return (Element: ComponentType<propsMergeReturnType<P, MS, MD>>): ComponentType<P> => (
    ownProps,
  ) => (
    <Consumer>
      {(store) => {
        const Subscription = getSubscription<S, P, MS, MD>(propsFactory(store.dispatch));
        return (
          <Subscription source={{ store, ownProps }}>
            {(props) => <Element {...props} />}
          </Subscription>
        );
      }}
    </Consumer>
  );
}

/**
 *
 * @param merge
 */
export function getSubscription<S, P, MS, MD>(
  merge: propsMergeType<S, P, MS, MD>,
): Subscription<subscriptionType<S, P>, propsMergeReturnType<P, MS, MD>> {
  // cache props object
  let nowProps: propsMergeReturnType<P, MS, MD>;
  return createSubscription<subscriptionType<S, P>, propsMergeReturnType<P, MS, MD>>({
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
