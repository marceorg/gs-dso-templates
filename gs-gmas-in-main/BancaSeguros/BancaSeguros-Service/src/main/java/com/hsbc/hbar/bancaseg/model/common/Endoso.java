/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.model.common;

public class Endoso {
	private Integer endoso;
	private Integer vigenciaDesde;
	private Integer vigenciaHasta;
	private String motivo;

	public Integer getEndoso() {
		return this.endoso;
	}

	public void setEndoso(final Integer endoso) {
		this.endoso = endoso;
	}

	public Integer getVigenciaDesde() {
		return this.vigenciaDesde;
	}

	public void setVigenciaDesde(final Integer vigenciaDesde) {
		this.vigenciaDesde = vigenciaDesde;
	}

	public Integer getVigenciaHasta() {
		return this.vigenciaHasta;
	}

	public void setVigenciaHasta(final Integer vigenciaHasta) {
		this.vigenciaHasta = vigenciaHasta;
	}

	public String getMotivo() {
		return this.motivo;
	}

	public void setMotivo(final String motivo) {
		this.motivo = motivo;
	}
}
