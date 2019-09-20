// tslint:disable:cyclomatic-complexity
import { isStrictEqual, shallowEqual } from './utils/connect';

import { mapDispatchToPropsType, mapStateToPropsType, mergedObjects, mergePropsType, storeDispatchType } from './types';

/**
 *
 * @param dispatch
 * @param mapStateToProps
 * @param mapDispatchToProps
 * @param mergeProps
 */
export const selector = <State, Props, MapState, MapDispatch>(
  dispatch: storeDispatchType,
  mapStateToProps: mapStateToPropsType<State, Props, MapState>,
  mapDispatchToProps: mapDispatchToPropsType<Props, MapDispatch>,
  mergeProps: mergePropsType<MapState, MapDispatch, Props>,
) => {
  let cachedState: State;
  let cachedProps: Props;
  let cachedMapState: MapState;
  let cachedMapDispatch: MapDispatch;
  let cachedMerge: mergedObjects<Props, MapState, MapDispatch>;

  return (state: State, props: Props): mergedObjects<Props, MapState, MapDispatch> => {
    const isStateChanged = cachedState === undefined || !isStrictEqual(cachedState, state);
    const isPropsChanged = cachedProps === undefined || !shallowEqual(cachedProps, props);
    let isMapStateChanged = false;
    let isMapDispatchChanged = false;
    let isMergeChanged = false;

    if (isStateChanged) {
      cachedState = state;
    }

    if (isPropsChanged) {
      cachedProps = props;
    }

    if (isStateChanged || (isPropsChanged && mapStateToProps.length > 1) || cachedMapState === undefined) {
      const mapState = mapStateToProps(cachedState, cachedProps);
      isMapStateChanged = cachedMapState === undefined || !shallowEqual(cachedMapState, mapState);

      if (isMapStateChanged) {
        cachedMapState = mapState;
      }
    }

    if ((isPropsChanged && mapDispatchToProps.length > 1) || cachedMapDispatch === undefined) {
      const mapDispatch = mapDispatchToProps(dispatch, cachedProps);
      isMapDispatchChanged = cachedMapDispatch === undefined || !shallowEqual(cachedMapDispatch, mapDispatch);

      if (isMapDispatchChanged) {
        cachedMapDispatch = mapDispatch;
      }
    }

    if (isPropsChanged || isMapStateChanged || isMapDispatchChanged || cachedMerge === undefined) {
      const merge = mergeProps(cachedMapState, cachedMapDispatch, cachedProps);
      isMergeChanged = cachedMerge === undefined || !shallowEqual(cachedMerge, merge);

      if (isMergeChanged) {
        cachedMerge = merge;
      }
    }

    return cachedMerge;
  };
};

/**
 *
 */
export default selector;
