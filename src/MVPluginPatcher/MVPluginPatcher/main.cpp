#include <iostream>
#include <fstream>
#include <sstream>
#include <string>


using namespace std;

int main() {
	// find the plugin.js file
	string plugins_path;
	if (FILE* file = fopen("www/js/plugins.js", "r")) {
		fclose(file);
		plugins_path = "www/js/plugins.js";
	}
	else if (FILE* file = fopen("js/plugins.js", "r")) {
		fclose(file);
		plugins_path = "js/plugins.js";
	}
	else {
		cout << "Could not find plugins.js\n";
	}

	// open the plugin.js file
	ifstream plugins_js;
	plugins_js.open(plugins_path);

	//  check for error opening
	if (!plugins_js.is_open()) {
		cout << "Could not open plugins.js\n";
	}

	// read in and convert to string
	string plugin_js_string((istreambuf_iterator<char>(plugins_js)), istreambuf_iterator<char>());
	plugins_js.close();

	// open the plugins_patch file
	ifstream patch;
	patch.open("plugins_patch.txt");

	// check for error opening
	if (!patch.is_open()) {
		cout << "Could not open patch.txt\n";
	}

	// read in and convert to string
	string patch_string((istreambuf_iterator<char>(patch)), istreambuf_iterator<char>());
	patch.close();

	// create stringstream for patch string
	stringstream patch_string_ss(patch_string);

	bool is_empty = false;
	size_t insertion_point = plugin_js_string.find_last_of('}');

	// Check that there was at least some plugin 
	if (insertion_point == string::npos) {
		insertion_point = plugin_js_string.find_last_of(']') - 1;
		is_empty = true;
	}
	else {
		insertion_point++;
	}

	string line;
	// go through each line and add the plugins
	while (getline(patch_string_ss, line)) {
		if (line.size() > 0 && line[0] == '{') {
			if (plugin_js_string.find(line) == string::npos) {
				// handling for empty (no comma on previous line)
				if (is_empty) {
					line.insert(0, "\n");
					is_empty = false;
				}
				else {
					line.insert(0, ",\n");
				}
				plugin_js_string.insert(insertion_point, line);
				// move point to after newly inserted
				insertion_point += line.length();
			}
		}
	}

	// writeback the new plugins
	ofstream plugin_js_write;
	plugin_js_write.open(plugins_path, ios::binary | ios::trunc);

	// close the file
	plugin_js_write.write(plugin_js_string.c_str(), plugin_js_string.size());
	plugin_js_write.close();

}