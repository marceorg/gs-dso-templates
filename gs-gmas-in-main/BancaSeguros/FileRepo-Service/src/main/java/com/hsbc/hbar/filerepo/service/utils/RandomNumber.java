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

import java.security.SecureRandom;

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
		Integer len = RandomNumber.LENGTH;
		SecureRandom sr = new SecureRandom();
		String result = (sr.nextInt(9) + 1) + "";
		for (int i = 0; i < len - 2; i++) {
			result += sr.nextInt(10);
		}
		result += (sr.nextInt(9) + 1);
		return result;
	}

	public String getRandomNumber() {
		return this.randomNumber;
	}
}
