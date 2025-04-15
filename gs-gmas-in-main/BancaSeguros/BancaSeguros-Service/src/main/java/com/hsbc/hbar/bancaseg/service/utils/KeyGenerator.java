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

import java.util.Arrays;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class KeyGenerator {
	static Logger logger = LogManager.getLogger(KeyGenerator.class);

	public static String getUserKey(final String specKey, final String user) {
		String key = null;

		try {
			Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding");
			SecretKeySpec keySpec = new SecretKeySpec(specKey.getBytes(), "AES");
			IvParameterSpec ivSpec = new IvParameterSpec(specKey.getBytes());

			cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);

			byte[] textToEncrypt = Arrays.copyOf(user.getBytes(), 48);

			byte[] outText = cipher.doFinal(textToEncrypt);
			key = new String(Base64.encodeBase64(outText)).trim();
		} catch (Exception e) {
			KeyGenerator.logger.error(e);
		}
		return key;
	}

	public static String getServerId(final String channelId) {
		GeneratorGlobalId generatorGlobalId = new GeneratorGlobalId();
		try {
			return generatorGlobalId.getGlobalId(channelId).toString();
		} catch (Exception e) {
			KeyGenerator.logger.error(e);
			return "1";
		}
	}
}
