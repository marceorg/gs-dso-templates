/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.model.constant;

public final class WASConstants {
	private WASConstants() {
		throw new IllegalAccessError("Constant class");
	}

	// Key OVNYL
	public static final String WC_OVNYL_KEY = System.getProperty("insurance.OVNYL_KEY");
}
