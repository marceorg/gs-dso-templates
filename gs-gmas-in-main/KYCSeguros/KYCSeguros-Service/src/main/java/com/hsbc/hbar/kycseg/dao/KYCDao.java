/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.dao;

import java.util.List;

import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersFis;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersJur;

public interface KYCDao {
	public List<KYCPersFis> getKYCPersFis(final Long numeroCUIL);

	public Boolean setKYCPersFis(final KYCPersFis kycPersFis, final AuthorizedUser operador);

	public void delKYCPersFis(final Long numeroCUIL);

	public List<KYCPersJur> getKYCPersJur(final Long numeroCUIT);

	public Boolean setKYCPersJur(final KYCPersJur kycPersJur, final AuthorizedUser operador);

	public void delKYCPersJur(final Long numeroCUIT);
}
