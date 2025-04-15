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

public class ConSiniestroInf {
	private String paramStart;
	private List<ConSiniestro> conSiniestroList;

	public String getParamStart() {
		return this.paramStart;
	}

	public void setParamStart(final String paramStart) {
		this.paramStart = paramStart;
	}

	public List<ConSiniestro> getConSiniestroList() {
		return this.conSiniestroList;
	}

	public void setConSiniestroList(final List<ConSiniestro> conSiniestroList) {
		this.conSiniestroList = conSiniestroList;
	}
}
