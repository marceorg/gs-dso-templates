/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2017. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service;

import com.hsbc.hbar.bancaseg.model.enums.DestinationEnum;
import com.hsbc.hbar.bancaseg.model.enums.MdwEnum;

public interface MdwService {
	public String getInsSvcGen(final DestinationEnum destination, final MdwEnum serviceName, final String request);
}
