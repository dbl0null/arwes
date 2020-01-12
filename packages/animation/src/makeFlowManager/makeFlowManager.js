import { STREAM } from '../constants';

function makeFlowManager (component) {
  let isFlowActivated = false;

  function checkMount () {
    if (!component.isAnimate()) {
      return;
    }

    const { parentEnergyContext } = component.props;

    if (parentEnergyContext && parentEnergyContext.type === STREAM) {
      parentEnergyContext._subscribe(component);
    }

    if (component.isOutsourced()) {
      return;
    }

    if (component.isActivated()) {
      component.enter();
    }
  }

  function checkUpdate () {
    if (!component.isAnimate() || component.isOutsourced()) {
      return;
    }

    const activated = component.isActivated();

    if (activated !== isFlowActivated) {
      isFlowActivated = activated;

      if (activated) {
        component.enter();
      }
      else {
        component.exit();
      }
    }
  }

  function checkUnmount () {
    if (!component.isAnimate()) {
      return;
    }

    const { parentEnergyContext } = component.props;

    if (parentEnergyContext && parentEnergyContext.type === STREAM) {
      parentEnergyContext._unsubscribe(component);
    }
  }

  return { checkMount, checkUpdate, checkUnmount };
}

export { makeFlowManager };
