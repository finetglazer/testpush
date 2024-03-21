// Credit: https://github.com/akveo/nebular/issues/1626#issuecomment-503623926

import { ElementRef, Injectable } from '@angular/core';
import {
  NbAdjustableConnectedPositionStrategy,
  NbGlobalPositionStrategy,
  NbPosition,
  NbPositionBuilderService,
} from '@nebular/theme';

export enum Position {
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
}

const HORIZONTAL_POSITIONS = [Position.TOP_RIGHT, Position.TOP_LEFT];

const additionalPositions = {
  [Position.TOP_RIGHT](offset) {
    return { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetY: 0, offsetX: offset };
  },
  [Position.TOP_LEFT](offset) {
    return { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetY: 0, offsetX: -offset };
  },
};

class AdjustableConnectedPositionStrategy extends NbAdjustableConnectedPositionStrategy {
  protected createPositions(): NbPosition[] {
    if (additionalPositions[this._position]) {
      return this.reorderPreferredPositions(HORIZONTAL_POSITIONS as any);
    } else {
      return super.createPositions();
    }
  }

  protected persistChosenPositions(positions: NbPosition[]) {
    if (additionalPositions[this._position]) {
      this.appliedPositions = positions.map((position: NbPosition) => ({
        key: position,
        connectedPosition: additionalPositions[position](this._offset),
      }));
    } else {
      super.persistChosenPositions(positions);
    }
  }
}

@Injectable()
export class PositionBuilderService extends NbPositionBuilderService {
  global(): NbGlobalPositionStrategy {
    return new NbGlobalPositionStrategy();
  }

  connectedTo(elementRef: ElementRef): NbAdjustableConnectedPositionStrategy {
    return new AdjustableConnectedPositionStrategy(
      elementRef,
      this.viewportRuler,
      this.document,
      this.platform,
      this.overlayContainer,
    )
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}
