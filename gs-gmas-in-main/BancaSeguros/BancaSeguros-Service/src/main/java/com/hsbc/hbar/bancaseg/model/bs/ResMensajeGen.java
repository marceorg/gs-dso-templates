/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2017. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.model.bs;

public class ResMensajeGen {
	private String estado;
	private String paramStart;
	private String jsonResult;

	public ResMensajeGen(String estado, String paramStart, String jsonResult) {
		super();
		this.estado = estado;
		this.paramStart = paramStart;
		this.jsonResult = jsonResult;
	}

	public String getEstado() {
		return this.estado;
	}
	
	public void setEstado(String estado) {
		this.estado = estado;
	}
	
	public String getParamStart() {
		return this.paramStart;
	}
	
	public void setParamStart(String paramStart) {
		this.paramStart = paramStart;
	}
	
	public String getJsonResult() {
		return this.jsonResult;
	}
	
	public void setJsonResult(String jsonResult) {
		this.jsonResult = jsonResult;
	}
}
