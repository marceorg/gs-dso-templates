/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.model.bs;

import java.util.List;

public class ConClienteInf {
	private String paramStart;
	private List<ConCliente> conClienteList;

	public String getParamStart() {
		return this.paramStart;
	}

	public void setParamStart(final String paramStart) {
		this.paramStart = paramStart;
	}

	public List<ConCliente> getConClienteList() {
		return this.conClienteList;
	}

	public void setConClienteList(final List<ConCliente> conClienteList) {
		this.conClienteList = conClienteList;
	}
}
