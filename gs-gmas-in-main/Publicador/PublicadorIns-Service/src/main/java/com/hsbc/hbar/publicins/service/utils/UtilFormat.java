/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.publicins.service.utils;

public class UtilFormat {
	public static String getValChars(final String strChars) {
		String result = strChars;
		// Acentos Minusculas
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 161), String.valueOf((char) 225));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 169), String.valueOf((char) 233));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 173), String.valueOf((char) 237));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 179), String.valueOf((char) 243));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 186), String.valueOf((char) 250));
		// Acentos Mayusculas
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 129), String.valueOf((char) 193));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 137), String.valueOf((char) 201));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 141), String.valueOf((char) 205));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 147), String.valueOf((char) 211));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 154), String.valueOf((char) 218));
		// Dieresis Minusculas
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 164), String.valueOf((char) 228));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 171), String.valueOf((char) 235));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 175), String.valueOf((char) 239));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 182), String.valueOf((char) 246));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 188), String.valueOf((char) 252));
		// Dieresis Mayusculas
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 132), String.valueOf((char) 196));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 139), String.valueOf((char) 203));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 143), String.valueOf((char) 207));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 150), String.valueOf((char) 214));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 156), String.valueOf((char) 220));
		// Enies
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 177), String.valueOf((char) 241));
		result = result.replace(String.valueOf((char) 195) + String.valueOf((char) 145), String.valueOf((char) 209));
		// Otros Caracteres
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

	public static String setNumberToDate(final Integer date) {
		String strDate = date.toString();

		if (strDate.length() != 8) {
			return "";
		} else {
			return strDate.substring(6, 8) + "/" + strDate.substring(4, 6) + "/" + strDate.substring(0, 4);
		}
	}

	public static String setSpecialChars(final String strChars) {
		String result = strChars;

		result = result.replace("&#xE1;", String.valueOf((char) 225));
		result = result.replace("&#xE9;", String.valueOf((char) 233));
		result = result.replace("&#xED;", String.valueOf((char) 237));
		result = result.replace("&#xF3;", String.valueOf((char) 243));
		result = result.replace("&#xFA;", String.valueOf((char) 250));
		result = result.replace("&#xC1;", String.valueOf((char) 193));
		result = result.replace("&#xC9;", String.valueOf((char) 201));
		result = result.replace("&#xCD;", String.valueOf((char) 205));
		result = result.replace("&#xD3;", String.valueOf((char) 211));
		result = result.replace("&#xDA;", String.valueOf((char) 218));
		result = result.replace("&#xE4;", String.valueOf((char) 228));
		result = result.replace("&#xEB;", String.valueOf((char) 235));
		result = result.replace("&#xEF;", String.valueOf((char) 239));
		result = result.replace("&#xF6;", String.valueOf((char) 246));
		result = result.replace("&#xFC;", String.valueOf((char) 252));
		result = result.replace("&#xC4;", String.valueOf((char) 196));
		result = result.replace("&#xCB;", String.valueOf((char) 203));
		result = result.replace("&#xCF;", String.valueOf((char) 207));
		result = result.replace("&#xD6;", String.valueOf((char) 214));
		result = result.replace("&#xDC;", String.valueOf((char) 220));
		result = result.replace("&#xF1;", String.valueOf((char) 241));
		result = result.replace("&#xD1;", String.valueOf((char) 209));
		result = result.replace("&#xB0;", String.valueOf((char) 176));
		result = result.replace("&#xAA;", String.valueOf((char) 170));
		result = result.replace("&#x22;", String.valueOf((char) 34));
		result = result.replace("&#x25;", String.valueOf((char) 37));
		result = result.replace("&#x5C;", "\\");
		result = result.replace("&#xA1;", String.valueOf((char) 161));
		result = result.replace("&#xBF;", String.valueOf((char) 191));
		result = result.replace("&#xAC;", String.valueOf((char) 172));
		result = result.replace("&#xB4;", String.valueOf((char) 180));
		result = result.replace("&#xA8;", String.valueOf((char) 168));
		result = result.replace("&#x09;", "\t");
		result = result.replace("&#x0A;", "\n");
		result = result.replace("&#x0D;", "\r");

		return result;
	}
}
