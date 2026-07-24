package com.railway.ticketBooking.config;

import com.railway.ticketBooking.entity.SeatType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "pricing")
public class PricingProperties {

    private Map<SeatType, BigDecimal> multipliers;

}