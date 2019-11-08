// tslint:disable:cyclomatic-complexity
import { isStrictEqual, mergeProps, shallowEqual } from './utils/connect';

import { mapDispatchToPropsType, mapStateToPropsType, storeDispatchType } from './types';

export class Selector {
  /**
   *
   * @param dispatch
   * @param mapStateToProps
   * @param mapDispatchToProps
   * @param mergeProps
   */
  create<State, Props, MapState, MapDispatch, ComponentProps>(
    dispatch: storeDispatchType,
    mapStateToProps: mapStateToPropsType<State, Props, MapState>,
    mapDispatchToProps: mapDispatchToPropsType<Props, MapDispatch>,
  ) {
    let cachedState: State;
    let cachedProps: Props;
    let cachedMapState: MapState;
    let cachedMapDispatch: MapDispatch;
    let cachedMerge: ComponentProps;

    return (state: State, props: Props): ComponentProps => {
      const isStateChanged = cachedState === undefined || !isStrictEqual(cachedState, state);
      const isPropsChanged = cachedProps === undefined || !shallowEqual(cachedProps, props);
      let isMapStateChanged = false;
      let isMapDispatchChanged = false;

      if (isStateChanged) {
        cachedState = state;
      }

      if (isPropsChanged) {
        cachedProps = props;
      }

      [cachedMapState, isMapStateChanged] = this.map(
        cachedMapState,
        isStateChanged || (isPropsChanged && mapStateToProps.length > 1),
        () => mapStateToProps(cachedState, cachedProps),
      );

      [cachedMapDispatch, isMapDispatchChanged] = this.map(
        cachedMapDispatch,
        isPropsChanged && mapDispatchToProps.length > 1,
        () => mapDispatchToProps(dispatch, cachedProps),
      );

      [cachedMerge] = this.map(cachedMerge, isPropsChanged || isMapStateChanged || isMapDispatchChanged, () =>
        mergeProps(cachedMapState, cachedMapDispatch, cachedProps),
      );

      return cachedMerge;
    };
  }

  /**
   *
   * @param cachedValue
   * @param isChanged
   * @param map
   */
  map<T>(cachedValue: T | undefined, isChanged: boolean, map: () => T): [T, boolean] {
    if (cachedValue === undefined) {
      return [map(), true];
    }

    if (isChanged) {
      const value = map();

      if (!shallowEqual(cachedValue, value)) {
        return [value, true];
      }
    }

    return [cachedValue, false];
  }
}

/**
 *
 */
export default new Selector();
