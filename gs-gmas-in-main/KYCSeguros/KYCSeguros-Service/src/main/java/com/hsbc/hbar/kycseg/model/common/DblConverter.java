/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.model.common;

import java.util.Locale;

import com.thoughtworks.xstream.converters.basic.DoubleConverter;

public class DblConverter extends DoubleConverter {
	@Override
	public String toString(final Object obj) {
		return (obj == null ? null : String.format(Locale.US, "%15.2f", obj)
				.trim());
	}
}
