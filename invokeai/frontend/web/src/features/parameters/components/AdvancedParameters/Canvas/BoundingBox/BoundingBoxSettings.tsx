import { Box, VStack } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import IAISlider from 'common/components/IAISlider';
import { canvasSelector } from 'features/canvas/store/canvasSelectors';
import { setBoundingBoxDimensions } from 'features/canvas/store/canvasSlice';
import { isEqual } from 'lodash-es';

import { useTranslation } from 'react-i18next';

const selector = createSelector(
  canvasSelector,
  (canvas) => {
    const { boundingBoxDimensions, boundingBoxScaleMethod: boundingBoxScale } =
      canvas;
    return {
      boundingBoxDimensions,
      boundingBoxScale,
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: isEqual,
    },
  }
);

const BoundingBoxSettings = () => {
  const dispatch = useAppDispatch();
  const { boundingBoxDimensions } = useAppSelector(selector);

  const { t } = useTranslation();

  const handleChangeWidth = (v: number) => {
    dispatch(
      setBoundingBoxDimensions({
        ...boundingBoxDimensions,
        width: Math.floor(v),
      })
    );
  };

  const handleChangeHeight = (v: number) => {
    dispatch(
      setBoundingBoxDimensions({
        ...boundingBoxDimensions,
        height: Math.floor(v),
      })
    );
  };

  const handleResetWidth = () => {
    dispatch(
      setBoundingBoxDimensions({
        ...boundingBoxDimensions,
        width: Math.floor(512),
      })
    );
  };

  const handleResetHeight = () => {
    dispatch(
      setBoundingBoxDimensions({
        ...boundingBoxDimensions,
        height: Math.floor(512),
      })
    );
  };

  return (
    <VStack gap={2} alignItems="stretch">
      <IAISlider
        label={t('parameters.width')}
        min={64}
        max={1024}
        step={64}
        value={boundingBoxDimensions.width}
        onChange={handleChangeWidth}
        sliderNumberInputProps={{ max: 4096 }}
        withSliderMarks
        withInput
        inputReadOnly
        withReset
        handleReset={handleResetWidth}
      />
      <IAISlider
        label={t('parameters.height')}
        min={64}
        max={1024}
        step={64}
        value={boundingBoxDimensions.height}
        onChange={handleChangeHeight}
        sliderNumberInputProps={{ max: 4096 }}
        withSliderMarks
        withInput
        inputReadOnly
        withReset
        handleReset={handleResetHeight}
      />
    </VStack>
  );
};

export default BoundingBoxSettings;

export const BoundingBoxSettingsHeader = () => {
  const { t } = useTranslation();
  return (
    <Box flex="1" textAlign="start">
      {t('parameters.boundingBoxHeader')}
    </Box>
  );
};
