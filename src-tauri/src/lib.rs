use tauri::Manager;

#[tauri::command]
fn connect_serial(port: String, baud_rate: u32) -> Result<String, String> {
    log::info!("尝试连接串口: {} @ {}", port, baud_rate);
    
    if port == "SIMULATE" {
        return Ok("模拟模式已启用".to_string());
    }
    
    // 实际串口连接逻辑
    // 注意: 实际使用时需要使用 serial 库的完整实现
    Ok(format!("串口 {} 已连接 (波特率: {})", port, baud_rate))
}

#[tauri::command]
fn disconnect_serial() -> Result<String, String> {
    log::info!("断开串口连接");
    Ok("串口已断开".to_string())
}

#[tauri::command]
fn list_serial_ports() -> Result<Vec<String>, String> {
    // 列出可用串口
    // 实际实现需要枚举系统串口设备
    let ports = vec![
        "COM1".to_string(),
        "COM2".to_string(),
        "/dev/ttyUSB0".to_string(),
        "/dev/cu.usbserial".to_string(),
    ];
    
    Ok(ports)
}

#[tauri::command]
fn read_from_serial(port: String) -> Result<Vec<u8>, String> {
    // 模拟数据读取
    if port == "SIMULATE" {
        let mut rng = rand::thread_rng();
        let value: u8 = rand::Rng::gen(&mut rng);
        return Ok(vec![value]);
    }
    
    Err("请先连接串口".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 初始化日志
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info"))
        .init();
    
    log::info!("QRngViewer 启动中...");
    
    tauri::Builder::default()
        .plugin(tauri_plugin_serialplugin::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            connect_serial,
            disconnect_serial,
            list_serial_ports,
            read_from_serial,
        ])
        .setup(|app| {
            log::info!("应用程序初始化完成");
            
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("启动时发生错误");
}
