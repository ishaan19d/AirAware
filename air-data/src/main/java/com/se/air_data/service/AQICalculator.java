package com.se.air_data.service;

import com.se.air_data.model.Components;

public class AQICalculator {

    public static int calculateAQI(Components components) {
        int aqiPm25 = getAQI(components.getPm2_5(), new double[]{0, 12, 35.4, 55.4, 150.4, 250.4, 500.4},
                                                 new int[]{0, 50, 100, 150, 200, 300, 500});
        int aqiPm10 = getAQI(components.getPm10(), new double[]{0, 54, 154, 254, 354, 424, 604},
                                                 new int[]{0, 50, 100, 150, 200, 300, 500});
        int aqiCO = getAQI(components.getCo() / 1000, new double[]{0, 4.4, 9.4, 12.4, 15.4, 30.4, 40.4},
                                                 new int[]{0, 50, 100, 150, 200, 300, 500});
        int aqiNO2 = getAQI(components.getNo2(), new double[]{0, 53, 100, 360, 649, 1249, 2049},
                                                 new int[]{0, 50, 100, 150, 200, 300, 500});
        int aqiSO2 = getAQI(components.getSo2(), new double[]{0, 35, 75, 185, 304, 604, 1004},
                                                 new int[]{0, 50, 100, 150, 200, 300, 500});
        int aqiO3 = getAQI(components.getO3(), new double[]{0, 54, 70, 85, 105, 200, 405},
                                                 new int[]{0, 50, 100, 150, 200, 300, 500});

        return Math.max(Math.max(aqiPm25, aqiPm10), Math.max(Math.max(aqiCO, aqiNO2), Math.max(aqiSO2, aqiO3)));
    }

    private static int getAQI(double concentration, double[] breakpoints, int[] aqiValues) {
        for (int i = 0; i < breakpoints.length - 1; i++) {
            if (concentration <= breakpoints[i + 1]) {
                return (int) ((aqiValues[i + 1] - aqiValues[i]) / (breakpoints[i + 1] - breakpoints[i]) * 
                              (concentration - breakpoints[i]) + aqiValues[i]);
            }
        }
        return 500; 
    }
}

