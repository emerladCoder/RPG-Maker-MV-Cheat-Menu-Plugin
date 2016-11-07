#include <iostream>
#include <fstream>
#include <sstream>>
#include <string>


using namespace std;

int main() {
	ifstream plugins_js;
	plugins_js.open(L"www/js/plugins.js");

	if (!plugins_js.is_open()) {
		cout << "Could not open plugins.js\n";
	}

	string plugin_js_string((istreambuf_iterator<char>(plugins_js)), istreambuf_iterator<char>());
	plugins_js.close();

	ifstream patch;
	patch.open(L"plugins_patch.txt");

	if (!patch.is_open()) {
		cout << "Could not open patch.txt\n";
	}

	string patch_string((istreambuf_iterator<char>(patch)), istreambuf_iterator<char>());
	patch.close();


	stringstream patch_string_ss(patch_string);

	int insertion_point = plugin_js_string.find_last_of('}') + 1;

	string line;
	while (getline(patch_string_ss, line)) {
		if (line.size() > 0 && line[0] == '{') {
			if (plugin_js_string.find(line) == string::npos) {
				line.insert(0, ",\n");
				plugin_js_string.insert(insertion_point, line);
			}
		}
	}

	ofstream plugin_js_write;
	plugin_js_write.open(L"www/js/plugins.js", ios::binary | ios::trunc);

	plugin_js_write.write(plugin_js_string.c_str(), plugin_js_string.size());
	plugin_js_write.close();

}