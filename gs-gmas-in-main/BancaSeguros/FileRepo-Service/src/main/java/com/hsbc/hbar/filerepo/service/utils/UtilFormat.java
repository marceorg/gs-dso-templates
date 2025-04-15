/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.service.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class UtilFormat {
	static Logger logger = LogManager.getLogger(UtilFormat.class);

	public static String getValChars(final String strChars) {
		String result = strChars;
		// vocales acentuadas minusculas
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 161), String.valueOf((char) 225));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 169), String.valueOf((char) 233));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 173), String.valueOf((char) 237));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 179), String.valueOf((char) 243));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 186), String.valueOf((char) 250));
		// enies
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 177), String.valueOf((char) 241));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 145), String.valueOf((char) 209));
		// vocales acentuadas mayusculas
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 129), String.valueOf((char) 193));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 137), String.valueOf((char) 201));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 141), String.valueOf((char) 205));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 147), String.valueOf((char) 211));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 154), String.valueOf((char) 218));
		// vocales dieresis minusculas
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 164), String.valueOf((char) 228));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 171), String.valueOf((char) 235));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 175), String.valueOf((char) 239));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 182), String.valueOf((char) 246));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 188), String.valueOf((char) 252));
		// vocales dieresis mayusculas
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 132), String.valueOf((char) 196));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 139), String.valueOf((char) 203));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 143), String.valueOf((char) 207));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 150), String.valueOf((char) 214));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 156), String.valueOf((char) 220));
		// otros caracteres especiales
		result = result.replace(String.valueOf((char) 194) + String.valueOf((char) 176), String.valueOf((char) 176));
		result = result.replace(String.valueOf((char) 194) + String.valueOf((char) 172), String.valueOf((char) 172));
		result = result.replace(String.valueOf((char) 194) + String.valueOf((char) 191), String.valueOf((char) 191));
		result = result.replace(String.valueOf((char) 194) + String.valueOf((char) 161), String.valueOf((char) 161));
		result = result.replace(String.valueOf((char) 194) + String.valueOf((char) 168), String.valueOf((char) 168));
		result = result.replace(String.valueOf((char) 194) + String.valueOf((char) 180), String.valueOf((char) 180));
		// -
		result = result.replace(String.valueOf((char) 226) + String.valueOf((char) 128) + String.valueOf((char) 147),
				String.valueOf((char) 45));
		// ~~ por &
		result = result.replace(String.valueOf((char) 126) + String.valueOf((char) 126), String.valueOf((char) 38));
		// ^^ por #
		result = result.replace(String.valueOf((char) 94) + String.valueOf((char) 94), String.valueOf((char) 35));
		// `` por +
		result = result.replace(String.valueOf((char) 96) + String.valueOf((char) 96), String.valueOf((char) 43));

		return result;
	}

	public static String getCharsAIS(final String strChars) {
		String result = strChars;
		// ~ a Enter
		result = result.replace(String.valueOf((char) 126), String.valueOf((char) 10));
		// ^ a Tab
		result = result.replace(String.valueOf((char) 94), String.valueOf((char) 9));

		return result;
	}

	public static String setCharsAIS(final String strChars) {
		String result = strChars;
		// Enter a ~
		result = result.replace(String.valueOf((char) 10), String.valueOf((char) 126));
		// Tab a ^
		result = result.replace(String.valueOf((char) 9), String.valueOf((char) 94));

		return result;
	}

	public static String setNumberToDate(final Integer date) {
		String strDate = date.toString();

		if (strDate.length() != 8) {
			return "";
		} else {
			return strDate.substring(6, 8) + "/" + strDate.substring(4, 6) + "/" + strDate.substring(0, 4);
		}
	}

	public static Integer getDateAIS(final Integer dateNumber) {
		String strDate = dateNumber.toString();

		if (strDate.length() != 8) {
			return 0;
		} else {
			return Integer.parseInt(strDate.substring(6, 8) + strDate.substring(4, 6) + strDate.substring(0, 4));
		}
	}

	public static Integer getDateNumber() {
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		String dateString = formatter.format(date);
		return Integer.parseInt(dateString);
	}

	public static Integer getDateNumber(final String fecha) {
		String dateString = "0";
		if (fecha.length() == 10) {
			dateString = fecha.substring(0, 4) + fecha.substring(5, 7) + fecha.substring(8, 10);
		}
		return Integer.parseInt(dateString);
	}

	public static String getDateTime() {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		return dateFormat.format(date);
	}

	public static String getDateText() {
		// Agregar Fecha
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		String dateString = formatter.format(date);
		StringBuilder dateResult = new StringBuilder();
		if (dateString.length() == 8) {
			dateResult.append(dateString.substring(6, 8));
			dateResult.append(" de ");
			switch (Integer.parseInt(dateString.substring(4, 6))) {
			case 1:
				dateResult.append("Enero");
				break;
			case 2:
				dateResult.append("Febrero");
				break;
			case 3:
				dateResult.append("Marzo");
				break;
			case 4:
				dateResult.append("Abril");
				break;
			case 5:
				dateResult.append("Mayo");
				break;
			case 6:
				dateResult.append("Junio");
				break;
			case 7:
				dateResult.append("Julio");
				break;
			case 8:
				dateResult.append("Agosto");
				break;
			case 9:
				dateResult.append("Septiembre");
				break;
			case 10:
				dateResult.append("Octubre");
				break;
			case 11:
				dateResult.append("Noviembre");
				break;
			case 12:
				dateResult.append("Diciembre");
				break;
			default:
				dateResult.append("");
			}
			dateResult.append(" de ");
			dateResult.append(dateString.substring(0, 4));
		}
		return dateResult.toString();
	}

	public static Integer getDateDiff(final Integer fechaInicio, final Integer fechaFin) {
		Integer dYY = Integer.parseInt(fechaInicio.toString().substring(0, 4));
		Integer dMM = Integer.parseInt(fechaInicio.toString().substring(4, 6)) - 1;
		Integer dDD = Integer.parseInt(fechaInicio.toString().substring(6, 8));
		Integer hYY = Integer.parseInt(fechaFin.toString().substring(0, 4));
		Integer hMM = Integer.parseInt(fechaFin.toString().substring(4, 6)) - 1;
		Integer hDD = Integer.parseInt(fechaFin.toString().substring(6, 8));
		Calendar c1 = Calendar.getInstance();
		c1.set(dYY, dMM, dDD);
		Calendar c2 = Calendar.getInstance();
		c2.set(hYY, hMM, hDD);
		Date d1 = c1.getTime();
		Date d2 = c2.getTime();
		long diff = d2.getTime() - d1.getTime();
		Integer diffDays = (int) (diff / (1000 * 24 * 60 * 60));
		return diffDays;
	}

	public static Integer getDateAdd(final Integer fecha, final String addType, final Integer addCant) {
		Integer retDate = 0;
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");

		Integer dYY = Integer.parseInt(fecha.toString().substring(0, 4));
		Integer dMM = Integer.parseInt(fecha.toString().substring(4, 6)) - 1;
		Integer dDD = Integer.parseInt(fecha.toString().substring(6, 8));
		Calendar cal = Calendar.getInstance();
		cal.set(dYY, dMM, dDD);

		if (addType.equalsIgnoreCase("D")) {
			cal.add(Calendar.DATE, addCant);
			String dateString = formatter.format(cal.getTime());
			retDate = Integer.parseInt(dateString);
		} else if (addType.equalsIgnoreCase("M")) {
			cal.add(Calendar.MONTH, addCant);
			String dateString = formatter.format(cal.getTime());
			retDate = Integer.parseInt(dateString);
		} else if (addType.equalsIgnoreCase("Y")) {
			cal.add(Calendar.YEAR, addCant);
			String dateString = formatter.format(cal.getTime());
			retDate = Integer.parseInt(dateString);
		}

		return retDate;
	}

	public static Integer getDateAge(final Integer fechaNacimiento) {
		Integer dYY = Integer.parseInt(fechaNacimiento.toString().substring(0, 4));
		Integer dMM = Integer.parseInt(fechaNacimiento.toString().substring(4, 6)) - 1;
		Integer dDD = Integer.parseInt(fechaNacimiento.toString().substring(6, 8));
		Integer fechaHoy = getDateNumber();
		Integer hYY = Integer.parseInt(fechaHoy.toString().substring(0, 4));
		Integer hMM = Integer.parseInt(fechaHoy.toString().substring(4, 6)) - 1;
		Integer hDD = Integer.parseInt(fechaHoy.toString().substring(6, 8));
		Calendar c1 = Calendar.getInstance();
		c1.set(dYY, dMM, dDD);
		Calendar c2 = Calendar.getInstance();
		c2.set(hYY, hMM, hDD);
		Integer diffYear = c2.get(Calendar.YEAR) - c1.get(Calendar.YEAR);
		Integer diffMonth = c2.get(Calendar.MONTH) - c1.get(Calendar.MONTH);
		Integer diffDay = c2.get(Calendar.DAY_OF_MONTH) - c1.get(Calendar.DAY_OF_MONTH);
		if (diffMonth < 0 || (diffMonth == 0 && diffDay < 0)) {
			diffYear = diffYear - 1;
		}
		return diffYear;
	}

	public static Integer getHourNumber() {
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("HHmmss");
		String dateString = formatter.format(date);
		return Integer.parseInt(dateString);
	}

	public static Boolean isNumber(final String num) {
		try {
			Integer.parseInt(num);
		} catch (Exception e) {
			UtilFormat.logger.error(e);
			return false;
		}
		return true;
	}
}
