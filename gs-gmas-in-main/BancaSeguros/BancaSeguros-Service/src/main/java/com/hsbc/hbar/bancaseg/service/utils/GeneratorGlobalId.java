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

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.Date;

public class GeneratorGlobalId {
	private static final String VERSION = "1";
	private static final int LENGTH_THREAD = 10;
	private static final int LENGTH_HC_CHANNEL = 12;

	public BigInteger getGlobalId(final String channel_id) throws Exception {
		String randomNumber = RandomNumber.getInstance().getRandomNumber();

		String globalId = GeneratorGlobalId.VERSION.concat(this.getHashCodeChannel(channel_id)).concat(this.getTimeStamp())
				.concat(this.getThreadId()).concat(randomNumber);

		BigInteger bigInteger = new BigInteger(globalId);
		return bigInteger;
	}

	private String getThreadId() {
		String threadId = String.valueOf(System.identityHashCode(Thread.currentThread()));

		if (threadId.length() == GeneratorGlobalId.LENGTH_THREAD) {
			return threadId;
		}
		if (threadId.length() < GeneratorGlobalId.LENGTH_THREAD) {
			String zero = "";
			int difference = GeneratorGlobalId.LENGTH_THREAD - threadId.length();
			for (int i = 0; i < difference; i++) {
				zero = zero.concat("0");
			}
			return zero.concat(threadId);
		}
		if (threadId.length() > GeneratorGlobalId.LENGTH_THREAD) {
			return threadId.substring(threadId.length() - GeneratorGlobalId.LENGTH_THREAD);
		}
		return threadId;
	}

	public String getTimeStamp() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddhhmmssSSS");
		return sdf.format(new Date());
	}

	public String getHashCodeChannel(final String channel) throws Exception {
		String hashString = String.valueOf(channel.hashCode());

		if (hashString.length() == GeneratorGlobalId.LENGTH_HC_CHANNEL) {
			return hashString;
		}
		if (hashString.length() < GeneratorGlobalId.LENGTH_HC_CHANNEL) {
			String zero = "";
			int difference = GeneratorGlobalId.LENGTH_HC_CHANNEL - hashString.length();
			for (int i = 0; i < difference; i++) {
				zero = zero.concat("0");
			}
			return zero.concat(hashString);
		}
		if (hashString.length() > GeneratorGlobalId.LENGTH_HC_CHANNEL) {
			return hashString.substring(hashString.length() - GeneratorGlobalId.LENGTH_HC_CHANNEL);
		}
		return hashString;
	}

}
