import {
  mapStateToPropsWithCacheType,
  mapDispatchToPropsWithCacheType,
  mergePropsWithCacheType,
  propsFactoryDispatchType,
  propsFactoryUpdateType,
  propsMergeReturnType,
  dispatchType,
  mapStateToPropsType,
  mapDispatchToPropsType,
  mergePropsType,
  equalType,
} from './types';

/**
 *
 * @param mapStateToProps
 * @param areStatesEqual
 * @param arePropsEqual
 */
export function mapStateToPropsWithCacheFactory<S, P, MS>(
  mapStateToProps: mapStateToPropsType<S, P, MS>,
  areStatesEqual: equalType<S, S>,
  arePropsEqual: equalType<P, P>,
): mapStateToPropsWithCacheType<S, P, MS> {
  let cachedState: S;
  let cachedProps: P;
  let cachedMapped: MS;

  return (state: S, props: P, hasDependsOnProps: boolean): MS => {
    if (cachedMapped === undefined) {
      // first call
      cachedState = state;
      cachedProps = props;
      cachedMapped = mapStateToProps(state, props);

      return cachedMapped;
    }

    const isStateChanged = !areStatesEqual(cachedState, state);
    const isPropsChanged = !arePropsEqual(cachedProps, props);

    if (isStateChanged) {
      cachedState = state;
    }

    if (isPropsChanged) {
      cachedProps = props;
    }

    if (isStateChanged || (isPropsChanged && hasDependsOnProps)) {
      cachedMapped = mapStateToProps(state, props);
    }

    return cachedMapped;
  };
}

/**
 *
 * @param mapDispatchToProps
 * @param arePropsEqual
 */
export function mapDispatchToPropsWithCacheFactory<P, MD>(
  mapDispatchToProps: mapDispatchToPropsType<P, MD>,
  arePropsEqual: equalType<P, P>,
): mapDispatchToPropsWithCacheType<P, MD> {
  let cachedProps: P;
  let cachedMapped: MD;

  return (dispatch: dispatchType, props: P, hasDependsOnProps: boolean): MD => {
    if (cachedMapped === undefined) {
      // first call
      cachedProps = props;
      cachedMapped = mapDispatchToProps(dispatch, props);

      return cachedMapped;
    }

    const isPropsChanged = !arePropsEqual(cachedProps, props);

    if (isPropsChanged) {
      cachedProps = props;
    }

    if (isPropsChanged && hasDependsOnProps) {
      cachedMapped = mapDispatchToProps(dispatch, props);
    }

    return cachedMapped;
  };
}

/**
 *
 * @param mergeProps
 * @param arePropsEqual
 * @param areMappedEqual
 * @param areDispatchedEqual
 * @param areMergedEqual
 */
export function mergePropsWithCacheFactory<P, MS, MD>(
  mergeProps: mergePropsType<MS, MD, P>,
  arePropsEqual: equalType<P, P>,
  areMappedEqual: equalType<MS, MS>,
  areDispatchedEqual: equalType<MD, MD>,
): mergePropsWithCacheType<MS, MD, P> {
  let cachedStateMapped: MS;
  let cachedDispatchMapped: MD;
  let cachedProps: P;
  let cachedMerged: propsMergeReturnType<P, MS, MD>;

  return (stateMapped: MS, dispatchMapped: MD, props: P) => {
    if (cachedMerged === undefined) {
      // first call
      cachedStateMapped = stateMapped;
      cachedDispatchMapped = dispatchMapped;
      cachedProps = props;
      cachedMerged = mergeProps(stateMapped, dispatchMapped, props);

      return cachedMerged;
    }

    const isPropsChanged = !arePropsEqual(cachedProps, props);
    const isStateMappedChanged = !areMappedEqual(cachedStateMapped, stateMapped);
    const isDispatchMappedChanged = !areDispatchedEqual(cachedDispatchMapped, dispatchMapped);

    if (isPropsChanged || isStateMappedChanged || isDispatchMappedChanged) {
      cachedMerged = mergeProps(stateMapped, dispatchMapped, props);
    }

    return cachedMerged;
  };
}

/**
 *
 * @param mapStateToPropsWithCache
 * @param mapDispatchToPropsWithCache
 * @param mergePropsWithCache
 * @param mapStateToProps
 * @param mapDispatchToProps
 */
export function propsFactory<S, P, MS, MD>(
  mapStateToPropsWithCache: mapStateToPropsWithCacheType<S, P, MS>,
  mapDispatchToPropsWithCache: mapDispatchToPropsWithCacheType<P, MD>,
  mergePropsWithCache: mergePropsWithCacheType<MS, MD, P>,
  mapStateToProps: mapStateToPropsType<S, P, MS>,
  mapDispatchToProps: mapDispatchToPropsType<P, MD>,
): propsFactoryDispatchType<S, P, MS, MD> {
  const hasStateToPropsDependsOnProps = mapStateToProps.length > 1;
  const hasDispatchToPropsDependsOnProps = mapDispatchToProps.length > 1;

  return (dispatch: dispatchType): propsFactoryUpdateType<S, P, MS, MD> => {
    return (state: S, props: P) => {
      const stateMapped = mapStateToPropsWithCache(state, props, hasStateToPropsDependsOnProps);
      const dispatchMapped = mapDispatchToPropsWithCache(dispatch, props, hasDispatchToPropsDependsOnProps);

      return mergePropsWithCache(stateMapped, dispatchMapped, props);
    };
  };
}
