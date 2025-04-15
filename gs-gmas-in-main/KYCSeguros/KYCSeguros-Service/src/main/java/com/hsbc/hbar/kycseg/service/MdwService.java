package com.hsbc.hbar.kycseg.service;

import com.hsbc.hbar.kycseg.model.enums.DestinationEnum;
import com.hsbc.hbar.kycseg.model.enums.MdwEnum;

public interface MdwService {
	public String getInsSvcGen(final DestinationEnum destination,
			final MdwEnum serviceName, final String request);
}
