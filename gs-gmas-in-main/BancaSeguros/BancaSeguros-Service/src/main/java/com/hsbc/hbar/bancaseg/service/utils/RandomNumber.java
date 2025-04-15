/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.utils;

import java.util.Random;

public class RandomNumber {

	private String randomNumber = null;
	private static RandomNumber instance = null;
	private static Object mutex = new Object();
	private static int LENGTH = 6;

	private RandomNumber() {
		this.randomNumber = this.randomNumberGenerate();
	}

	public static RandomNumber getInstance() {
		synchronized (RandomNumber.mutex) {
			if (RandomNumber.instance == null) {
				RandomNumber.instance = new RandomNumber();
			}
		}

		return RandomNumber.instance;
	}

	public String randomNumberGenerate() {
		String rndNumber = String.valueOf(new Random().nextInt(999999));

		if (rndNumber.length() == RandomNumber.LENGTH) {
			return rndNumber;
		}
		if (rndNumber.length() < RandomNumber.LENGTH) {
			String zero = "";
			int difference = RandomNumber.LENGTH - rndNumber.length();
			for (int i = 0; i < difference; i++) {
				zero = zero.concat("0");
			}
			return zero.concat(rndNumber);
		}
		if (rndNumber.length() > RandomNumber.LENGTH) {
			return rndNumber.substring(rndNumber.length() - RandomNumber.LENGTH);
		}
		return rndNumber;
	}

	public String getRandomNumber() {
		return this.randomNumber;
	}
}
