/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.service.impl;

import java.util.List;

import com.hsbc.hbar.kycseg.dao.CPFinderDao;
import com.hsbc.hbar.kycseg.model.common.CPFinder;
import com.hsbc.hbar.kycseg.service.CPFinderService;
import com.hsbc.hbar.kycseg.service.utils.UtilFormat;

public class CPFinderServiceImpl implements CPFinderService {

	private CPFinderDao cpFinderDao;

	public CPFinderDao getCPFinderDao() {
		if (this.cpFinderDao == null) {
			this.cpFinderDao = (CPFinderDao) ServiceFactory.getContext()
					.getBean("CPFinderDao");
		}
		return this.cpFinderDao;
	}

	public void setCPFinderDao(final CPFinderDao cpFinderDao) {
		this.cpFinderDao = cpFinderDao;
	}

	public List<CPFinder> getCPList(final Integer provincia,
			final String calleLoc) {
		return this.getCPFinderDao().getCPList(provincia,
				UtilFormat.getValChars(calleLoc));
	}

	public Boolean getValCPXAltura(final String calle, final String numero,
			final String codigoPostal) {
		return this.getCPFinderDao().getValCPXAltura(
				UtilFormat.getValChars(calle), numero, codigoPostal);
	}
}
