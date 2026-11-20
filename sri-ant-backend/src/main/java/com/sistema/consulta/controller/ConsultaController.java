package com.sistema.consulta.controller;

import com.sistema.consulta.service.AntService;
import com.sistema.consulta.service.SriService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ConsultaController {

    private final SriService sriService;
    private final AntService antService;

    @GetMapping("/contribuyente/{ruc}")
    public ResponseEntity<?> contribuyente(@PathVariable String ruc) {
        try {
            return ResponseEntity.ok(sriService.validarYObterContribuyente(ruc));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/vehiculo/{placa}")
    public ResponseEntity<?> vehiculo(@PathVariable String placa) {
        return ResponseEntity.ok(sriService.obtenerVehiculoPorPlaca(placa));
    }

    @GetMapping("/licencia/{cedula}")
    public ResponseEntity<?> licencia(
            @PathVariable String cedula,
            @RequestParam(defaultValue = "") String placa) {
        try {
            return ResponseEntity.ok(antService.consultarPuntosLicencia(cedula, placa));
        } catch (RuntimeException e) {
            return ResponseEntity.status(503).body(Map.of("error", e.getMessage()));
        }
    }
}